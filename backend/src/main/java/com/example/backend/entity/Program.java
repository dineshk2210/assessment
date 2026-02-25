package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String code;

    private String courseType; // UG / PG
    private String entryType; // Regular / Lateral
    private String academicYear;

    private Integer totalIntake;

    @ManyToOne
    @JoinColumn(name = "institution_id")
    private Institution institution;

    @JsonIgnore
    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL)
    private List<Quota> quotas = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL)
    private List<Applicant> applicants = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL)
    private List<Admission> admissions = new ArrayList<>();
}