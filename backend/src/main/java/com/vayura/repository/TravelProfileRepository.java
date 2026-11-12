package com.vayura.repository;

import com.vayura.entity.TravelProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelProfileRepository extends JpaRepository<TravelProfile, String> {

    List<TravelProfile> findByUserIdOrderByCreatedAtDesc(String userId);
}
