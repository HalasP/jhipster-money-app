package com.halas.money.repository;

import com.halas.money.domain.MoneyUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the MoneyUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MoneyUserRepository extends JpaRepository<MoneyUser, Long> {

    @Query("select moneyUser from MoneyUser moneyUser where moneyUser.owner.login = ?#{principal.username}")
    List<MoneyUser> findByOwnerIsCurrentUser();

}
