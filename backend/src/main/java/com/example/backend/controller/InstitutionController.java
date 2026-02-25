package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Institution;
import com.example.backend.repository.InstitutionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/institutions")
@RequiredArgsConstructor
@CrossOrigin
public class InstitutionController {

    private final InstitutionRepository institutionRepository;

    @PostMapping
    public Institution createInstitution(@RequestBody Institution institution) {
        return institutionRepository.save(institution);
    }

    @GetMapping
    public List<Institution> getAll() {
        return institutionRepository.findAll();
    }
}