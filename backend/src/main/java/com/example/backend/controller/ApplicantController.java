package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Applicant;
import com.example.backend.repository.ApplicantRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/applicants")
@RequiredArgsConstructor
@CrossOrigin
public class ApplicantController {

    private final ApplicantRepository applicantRepository;
    private final com.example.backend.repository.InstitutionRepository institutionRepository;
    private final com.example.backend.repository.ProgramRepository programRepository;

    @PostMapping
    public Applicant createApplicant(@RequestBody Applicant applicant) {
        if (applicant.getInstitution() != null && applicant.getInstitution().getId() != null) {
            applicant.setInstitution(institutionRepository.findById(applicant.getInstitution().getId()).orElse(null));
        }
        if (applicant.getProgram() != null && applicant.getProgram().getId() != null) {
            applicant.setProgram(programRepository.findById(applicant.getProgram().getId()).orElse(null));
        }

        applicant.setDocumentStatus("Pending");
        return applicantRepository.save(applicant);
    }

    @GetMapping
    public List<Applicant> getAllApplicants() {
        return applicantRepository.findAll();
    }

    @PutMapping("/{id}/verify")
    public Applicant verifyDocuments(@PathVariable Long id) {

        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));

        applicant.setDocumentStatus("Verified");

        return applicantRepository.save(applicant);
    }
}