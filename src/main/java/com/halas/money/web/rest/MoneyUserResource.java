package com.halas.money.web.rest;

import com.halas.money.domain.MoneyUser;
import com.halas.money.repository.MoneyUserRepository;
import com.halas.money.repository.search.MoneyUserSearchRepository;
import com.halas.money.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.halas.money.domain.MoneyUser}.
 */
@RestController
@RequestMapping("/api")
public class MoneyUserResource {

    private final Logger log = LoggerFactory.getLogger(MoneyUserResource.class);

    private static final String ENTITY_NAME = "moneyUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MoneyUserRepository moneyUserRepository;

    private final MoneyUserSearchRepository moneyUserSearchRepository;

    public MoneyUserResource(MoneyUserRepository moneyUserRepository, MoneyUserSearchRepository moneyUserSearchRepository) {
        this.moneyUserRepository = moneyUserRepository;
        this.moneyUserSearchRepository = moneyUserSearchRepository;
    }

    /**
     * {@code POST  /money-users} : Create a new moneyUser.
     *
     * @param moneyUser the moneyUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new moneyUser, or with status {@code 400 (Bad Request)} if the moneyUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/money-users")
    public ResponseEntity<MoneyUser> createMoneyUser(@RequestBody MoneyUser moneyUser) throws URISyntaxException {
        log.debug("REST request to save MoneyUser : {}", moneyUser);
        if (moneyUser.getId() != null) {
            throw new BadRequestAlertException("A new moneyUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MoneyUser result = moneyUserRepository.save(moneyUser);
        moneyUserSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/money-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /money-users} : Updates an existing moneyUser.
     *
     * @param moneyUser the moneyUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated moneyUser,
     * or with status {@code 400 (Bad Request)} if the moneyUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the moneyUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/money-users")
    public ResponseEntity<MoneyUser> updateMoneyUser(@RequestBody MoneyUser moneyUser) throws URISyntaxException {
        log.debug("REST request to update MoneyUser : {}", moneyUser);
        if (moneyUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MoneyUser result = moneyUserRepository.save(moneyUser);
        moneyUserSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, moneyUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /money-users} : get all the moneyUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of moneyUsers in body.
     */
    @GetMapping("/money-users")
    public List<MoneyUser> getAllMoneyUsers() {
        log.debug("REST request to get all MoneyUsers");
        return moneyUserRepository.findAll();
    }

    /**
     * {@code GET  /money-users/:id} : get the "id" moneyUser.
     *
     * @param id the id of the moneyUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the moneyUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/money-users/{id}")
    public ResponseEntity<MoneyUser> getMoneyUser(@PathVariable Long id) {
        log.debug("REST request to get MoneyUser : {}", id);
        Optional<MoneyUser> moneyUser = moneyUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(moneyUser);
    }

    /**
     * {@code DELETE  /money-users/:id} : delete the "id" moneyUser.
     *
     * @param id the id of the moneyUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/money-users/{id}")
    public ResponseEntity<Void> deleteMoneyUser(@PathVariable Long id) {
        log.debug("REST request to delete MoneyUser : {}", id);
        moneyUserRepository.deleteById(id);
        moneyUserSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/money-users?query=:query} : search for the moneyUser corresponding
     * to the query.
     *
     * @param query the query of the moneyUser search.
     * @return the result of the search.
     */
    @GetMapping("/_search/money-users")
    public List<MoneyUser> searchMoneyUsers(@RequestParam String query) {
        log.debug("REST request to search MoneyUsers for query {}", query);
        return StreamSupport
            .stream(moneyUserSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
