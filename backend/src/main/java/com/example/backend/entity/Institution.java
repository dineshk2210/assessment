package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    private String name;

    private Integer maxIntake; // Institution-level cap

    @JsonIgnore
    @OneToMany(mappedBy = "institution", cascade = CascadeType.ALL)
    private List<Program> programs = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "institution", cascade = CascadeType.ALL)
    private List<Applicant> applicants = new ArrayList<>();
}