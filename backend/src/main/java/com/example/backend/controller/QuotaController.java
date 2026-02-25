package com.example.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Program;
import com.example.backend.entity.Quota;
import com.example.backend.repository.ProgramRepository;
import com.example.backend.repository.QuotaRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/quotas")
@RequiredArgsConstructor
@CrossOrigin
public class QuotaController {

    private final QuotaRepository quotaRepository;
    private final ProgramRepository programRepository;

    @PostMapping
    public Quota createQuota(@RequestBody Quota quota) {
        Long programId = quota.getProgram().getId();
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Optional<Quota> existingQuotaOpt = quotaRepository.findByProgramIdAndQuotaType(programId, quota.getQuotaType());

        List<Quota> allQuotas = quotaRepository.findByProgramId(programId);
        int totalSeatsUsedByOthers;
        Quota quotaToSave;

        if (existingQuotaOpt.isPresent()) {
            quotaToSave = existingQuotaOpt.get();
            totalSeatsUsedByOthers = allQuotas.stream()
                    .filter(q -> !q.getId().equals(quotaToSave.getId()))
                    .mapToInt(Quota::getSeatLimit)
                    .sum();
            quotaToSave.setSeatLimit(quota.getSeatLimit());
        } else {
            quotaToSave = quota;
            quotaToSave.setProgram(program);
            totalSeatsUsedByOthers = allQuotas.stream()
                    .mapToInt(Quota::getSeatLimit)
                    .sum();
        }

        if (totalSeatsUsedByOthers + quotaToSave.getSeatLimit() > program.getTotalIntake()) {
            throw new RuntimeException("Total quota exceeds program intake (" + program.getTotalIntake() + ")");
        }

        return quotaRepository.save(quotaToSave);
    }

    @PutMapping("/{id}")
    public Quota updateQuota(@PathVariable Long id,
            @RequestBody Quota quotaDetails) {
        Quota quota = quotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quota not found"));

        Program program = quota.getProgram();
        List<Quota> otherQuotas = quotaRepository.findByProgramId(program.getId())
                .stream().filter(q -> !q.getId().equals(id)).toList();

        int otherSeatsUsed = otherQuotas.stream().mapToInt(Quota::getSeatLimit).sum();

        if (otherSeatsUsed + quotaDetails.getSeatLimit() > program.getTotalIntake()) {
            throw new RuntimeException("Total quota exceeds program intake (" + program.getTotalIntake() + ")");
        }

        quota.setSeatLimit(quotaDetails.getSeatLimit());
        quota.setQuotaType(quotaDetails.getQuotaType());

        return quotaRepository.save(quota);
    }

    @GetMapping
    public List<Quota> getAll() {
        return quotaRepository.findAll();
    }
}