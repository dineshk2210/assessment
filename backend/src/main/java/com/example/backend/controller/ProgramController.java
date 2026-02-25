package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Institution;
import com.example.backend.entity.Program;
import com.example.backend.repository.InstitutionRepository;
import com.example.backend.repository.ProgramRepository;
import com.example.backend.repository.QuotaRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/programs")
@RequiredArgsConstructor
@CrossOrigin
public class ProgramController {

    private final ProgramRepository programRepository;
    private final InstitutionRepository institutionRepository;
    private final QuotaRepository quotaRepository;

    @PostMapping
    public Program createProgram(@RequestBody Program program) {

        Long institutionId = program.getInstitution().getId();

        Institution institution = institutionRepository.findById(institutionId)
                .orElseThrow(() -> new RuntimeException("Institution not found"));

        // Validate institution-level cap
        int currentTotalIntake = institution.getPrograms().stream()
                .mapToInt(Program::getTotalIntake)
                .sum();

        if (institution.getMaxIntake() != null
                && currentTotalIntake + program.getTotalIntake() > institution.getMaxIntake()) {
            throw new RuntimeException("Institution intake cap exceeded! (Max: " + institution.getMaxIntake() + ")");
        }

        program.setInstitution(institution);

        return programRepository.save(program);
    }

    @GetMapping
    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    @GetMapping("/institution/{institutionId}")
    public List<Program> getByInstitution(@org.springframework.web.bind.annotation.PathVariable Long institutionId) {
        return programRepository.findByInstitutionId(institutionId);
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public Program updateProgram(@org.springframework.web.bind.annotation.PathVariable Long id,
            @RequestBody Program programDetails) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        // If intake is being changed, validate against existing quotas and institution
        // cap
        if (programDetails.getTotalIntake() != null
                && !programDetails.getTotalIntake().equals(program.getTotalIntake())) {

            // Validate Quotas
            int totalQuotas = quotaRepository.findByProgramId(id).stream()
                    .mapToInt(com.example.backend.entity.Quota::getSeatLimit).sum();
            if (programDetails.getTotalIntake() < totalQuotas) {
                throw new RuntimeException("New intake (" + programDetails.getTotalIntake()
                        + ") is less than total allocated quotas (" + totalQuotas + ")");
            }

            // Validate Institution Cap
            Institution institution = program.getInstitution();
            if (institution != null && institution.getMaxIntake() != null) {
                int otherProgramsIntake = institution.getPrograms().stream()
                        .filter(p -> !p.getId().equals(id))
                        .mapToInt(Program::getTotalIntake)
                        .sum();

                if (otherProgramsIntake + programDetails.getTotalIntake() > institution.getMaxIntake()) {
                    throw new RuntimeException(
                            "Institution intake cap exceeded! (Max: " + institution.getMaxIntake() + ")");
                }
            }
        }

        program.setName(programDetails.getName());
        program.setCode(programDetails.getCode());
        program.setCourseType(programDetails.getCourseType());
        program.setEntryType(programDetails.getEntryType());
        program.setAcademicYear(programDetails.getAcademicYear());
        program.setTotalIntake(programDetails.getTotalIntake());

        return programRepository.save(program);
    }
}