package com.halas.money.repository;

import com.halas.money.domain.Liability;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Liability entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LiabilityRepository extends JpaRepository<Liability, Long> {

}
