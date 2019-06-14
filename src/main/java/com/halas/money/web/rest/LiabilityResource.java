package com.halas.money.web.rest;

import com.halas.money.domain.Liability;
import com.halas.money.repository.LiabilityRepository;
import com.halas.money.repository.search.LiabilitySearchRepository;
import com.halas.money.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.halas.money.domain.Liability}.
 */
@RestController
@RequestMapping("/api")
public class LiabilityResource {

    private final Logger log = LoggerFactory.getLogger(LiabilityResource.class);

    private static final String ENTITY_NAME = "liability";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LiabilityRepository liabilityRepository;

    private final LiabilitySearchRepository liabilitySearchRepository;

    public LiabilityResource(LiabilityRepository liabilityRepository, LiabilitySearchRepository liabilitySearchRepository) {
        this.liabilityRepository = liabilityRepository;
        this.liabilitySearchRepository = liabilitySearchRepository;
    }

    /**
     * {@code POST  /liabilities} : Create a new liability.
     *
     * @param liability the liability to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new liability, or with status {@code 400 (Bad Request)} if the liability has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/liabilities")
    public ResponseEntity<Liability> createLiability(@Valid @RequestBody Liability liability) throws URISyntaxException {
        log.debug("REST request to save Liability : {}", liability);
        if (liability.getId() != null) {
            throw new BadRequestAlertException("A new liability cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Liability result = liabilityRepository.save(liability);
        liabilitySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/liabilities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /liabilities} : Updates an existing liability.
     *
     * @param liability the liability to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated liability,
     * or with status {@code 400 (Bad Request)} if the liability is not valid,
     * or with status {@code 500 (Internal Server Error)} if the liability couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/liabilities")
    public ResponseEntity<Liability> updateLiability(@Valid @RequestBody Liability liability) throws URISyntaxException {
        log.debug("REST request to update Liability : {}", liability);
        if (liability.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Liability result = liabilityRepository.save(liability);
        liabilitySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, liability.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /liabilities} : get all the liabilities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of liabilities in body.
     */
    @GetMapping("/liabilities")
    public List<Liability> getAllLiabilities() {
        log.debug("REST request to get all Liabilities");
        return liabilityRepository.findAll();
    }

    /**
     * {@code GET  /liabilities/:id} : get the "id" liability.
     *
     * @param id the id of the liability to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the liability, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/liabilities/{id}")
    public ResponseEntity<Liability> getLiability(@PathVariable Long id) {
        log.debug("REST request to get Liability : {}", id);
        Optional<Liability> liability = liabilityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(liability);
    }

    /**
     * {@code DELETE  /liabilities/:id} : delete the "id" liability.
     *
     * @param id the id of the liability to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/liabilities/{id}")
    public ResponseEntity<Void> deleteLiability(@PathVariable Long id) {
        log.debug("REST request to delete Liability : {}", id);
        liabilityRepository.deleteById(id);
        liabilitySearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/liabilities?query=:query} : search for the liability corresponding
     * to the query.
     *
     * @param query the query of the liability search.
     * @return the result of the search.
     */
    @GetMapping("/_search/liabilities")
    public List<Liability> searchLiabilities(@RequestParam String query) {
        log.debug("REST request to search Liabilities for query {}", query);
        return StreamSupport
            .stream(liabilitySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
