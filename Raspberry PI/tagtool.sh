#!/usr/bin/env python
from __future__ import print_function

import logging
log = logging.getLogger('main')

# Some standard libraries
import sys
import time
import string
import struct
import argparse
import hmac, hashlib

from cli import CommandLineInterface

# NFC libraries
import nfc
import nfc.clf

# HTTP module
import requests

#
# command parsers
#
def add_show_parser(parser):
    pass
         
class TagTool(CommandLineInterface):
    def __init__(self):
        parser = ArgumentParser(
            formatter_class=argparse.RawDescriptionHelpFormatter,
            description="")
        parser.add_argument(
            "-p", dest="authenticate", metavar="PASSWORD",
            help="unlock with password if supported")
        subparsers = parser.add_subparsers(
            title="commands", dest="command")
        add_show_parser(subparsers.add_parser(
                'show -l'))

        self.rdwr_commands = {"show -l": self.show_tag,}
    
        super(TagTool, self).__init__(
            parser, groups="rdwr card dbg clf")

    def on_rdwr_startup(self, targets):
        if self.options.command in self.rdwr_commands.keys():
            print("** waiting for a tag **", file=sys.stderr)
            return targets

    def on_rdwr_connect(self, tag):
        if self.options.authenticate is not None:
            if len(self.options.authenticate) > 0:
                key, msg = self.options.authenticate, tag.identifier
                password = hmac.new(key, msg, hashlib.sha256).digest()
            else:
                password = "" # use factory default password
            result = tag.authenticate(password)
            if result is False:
                print("I'm sorry, but authentication failed.")
                return False
            if result is None:
                print(tag)
                print("I don't know how to authenticate this tag.")
                return False
            
        self.rdwr_commands[self.options.command](tag)
        return self.options.wait or self.options.loop
    
    def on_card_startup(self, target):
        pass

    def show_tag(self, tag):
        print(tag)
        self.id_card = tag.identifier.encode("hex")
        data = {"card_id": self.id_card} #This line allows us to retrieve the id of the card
        try:
            # Send the card id to the server CHANGE THE URL WITH THE REAL ONE
            r = requests.post("http://localhost:8080", data = data) 
            print(r.status_code)
            print(r.text)
        except requests.exceptions.ConnectionError:
            print("Connection failed")
        
            
        
        


class ArgparseError(SystemExit):
    def __init__(self, prog, message):
        super(ArgparseError, self).__init__(2, prog, message)
    
    def __str__(self):
        return '{0}: {1}'.format(self.args[1], self.args[2])

class ArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        raise ArgparseError(self.prog, message)

if __name__ == '__main__':
    try:
        TagTool().run()
    except ArgparseError as e:
        prog = e.args[1].split()
    else:
        sys.exit(0)

    if len(prog) == 1:
        sys.argv = sys.argv + ['show -l']

    try:
        TagTool().run()
        
    except ArgparseError as e:
        print(e, file=sys.stderr)
