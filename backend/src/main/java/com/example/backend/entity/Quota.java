package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Version;
import jakarta.persistence.CascadeType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
public class Quota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String quotaType; // KCET / COMEDK / Management

    private Integer seatLimit;

    private Integer seatsFilled = 0;

    @Version
    private Integer version;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;

    @JsonIgnore
    @OneToMany(mappedBy = "quota", cascade = CascadeType.ALL)
    private List<Admission> admissions = new ArrayList<>();
}