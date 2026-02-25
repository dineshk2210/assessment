package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Admission;
import com.example.backend.repository.AdmissionRepository;
import com.example.backend.service.AdmissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admissions")
@RequiredArgsConstructor
@CrossOrigin
public class AdmissionController {

    private final AdmissionService admissionService;
    private final AdmissionRepository admissionRepository;

    @PostMapping("/allocate")
    public Admission allocate(@RequestParam Long applicantId,
                              @RequestParam Long programId,
                              @RequestParam String quotaType) {

        return admissionService.allocateSeat(applicantId, programId, quotaType);
    }

    @PostMapping("/confirm/{id}")
    public Admission confirm(@PathVariable Long id) {
        return admissionService.confirmAdmission(id);
    }

    @PutMapping("/{id}/fee")
    public Admission updateFeeStatus(@PathVariable Long id,
                                    @RequestParam String status) {

        Admission admission = admissionService.updateFeeStatus(id, status);
        return admission;
    }

    @GetMapping
    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }
}