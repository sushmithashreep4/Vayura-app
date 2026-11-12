package com.vayura.controller;

import com.vayura.entity.TravelProfile;
import com.vayura.repository.TravelProfileRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for travel profile management.
 */
@RestController
@RequestMapping("/api/profiles")
public class TravelProfileController {

    private final TravelProfileRepository profileRepository;

    public TravelProfileController(TravelProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @PostMapping
    public ResponseEntity<TravelProfile> create(@Valid @RequestBody TravelProfile profile) {
        TravelProfile saved = profileRepository.save(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelProfile> get(@PathVariable String id) {
        return profileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TravelProfile>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(profileRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TravelProfile> update(
            @PathVariable String id,
            @Valid @RequestBody TravelProfile profile) {
        return profileRepository.findById(id).map(existing -> {
            profile.setId(id);
            return ResponseEntity.ok(profileRepository.save(profile));
        }).orElse(ResponseEntity.notFound().build());
    }
}
