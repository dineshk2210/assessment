package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Institution;

public interface InstitutionRepository extends JpaRepository<Institution, Long> {
}