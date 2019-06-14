package com.halas.money.repository;

import com.halas.money.domain.NetWorth;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the NetWorth entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NetWorthRepository extends JpaRepository<NetWorth, Long> {

}
