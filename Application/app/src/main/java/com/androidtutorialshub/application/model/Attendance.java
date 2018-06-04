package com.androidtutorialshub.application.model;

import java.util.Date;

/**
 * Created by Florian on 03/06/2018.
 */

public class Attendance {

    private String module;
    private String jour;
    private Date date;
    private Date heureDebut;
    private Date heureFin;
    private String professeur;
    private String motif;

    public Attendance() {
        // Default Constuctor
    }

    public Attendance(String module, String jour, Date date, Date heureDebut,
                      Date heureFin, String professeur, String motif) {
        this.module = module;
        this.jour = jour;
        this.date = date;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.professeur = professeur;
        this.motif = motif;

    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getJour() {
        return jour;
    }

    public void setJour(String jour) {
        this.jour = jour;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Date getHeureDebut() {
        return heureDebut;
    }

    public void setHeureDebut(Date heureDebut) {
        this.heureDebut = heureDebut;
    }

    public Date getHeureFin() {
        return heureFin;
    }

    public void setHeureFin(Date heureFin) {
        this.heureFin = heureFin;
    }

    public String getProfesseur() {
        return professeur;
    }

    public void setProfesseur(String professeur) {
        this.professeur = professeur;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }



}
