package com.halas.money.web.rest;

import com.halas.money.domain.NetWorth;
import com.halas.money.repository.NetWorthRepository;
import com.halas.money.repository.search.NetWorthSearchRepository;
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
 * REST controller for managing {@link com.halas.money.domain.NetWorth}.
 */
@RestController
@RequestMapping("/api")
public class NetWorthResource {

    private final Logger log = LoggerFactory.getLogger(NetWorthResource.class);

    private static final String ENTITY_NAME = "netWorth";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NetWorthRepository netWorthRepository;

    private final NetWorthSearchRepository netWorthSearchRepository;

    public NetWorthResource(NetWorthRepository netWorthRepository, NetWorthSearchRepository netWorthSearchRepository) {
        this.netWorthRepository = netWorthRepository;
        this.netWorthSearchRepository = netWorthSearchRepository;
    }

    /**
     * {@code POST  /net-worths} : Create a new netWorth.
     *
     * @param netWorth the netWorth to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new netWorth, or with status {@code 400 (Bad Request)} if the netWorth has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/net-worths")
    public ResponseEntity<NetWorth> createNetWorth(@Valid @RequestBody NetWorth netWorth) throws URISyntaxException {
        log.debug("REST request to save NetWorth : {}", netWorth);
        if (netWorth.getId() != null) {
            throw new BadRequestAlertException("A new netWorth cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NetWorth result = netWorthRepository.save(netWorth);
        netWorthSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/net-worths/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /net-worths} : Updates an existing netWorth.
     *
     * @param netWorth the netWorth to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated netWorth,
     * or with status {@code 400 (Bad Request)} if the netWorth is not valid,
     * or with status {@code 500 (Internal Server Error)} if the netWorth couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/net-worths")
    public ResponseEntity<NetWorth> updateNetWorth(@Valid @RequestBody NetWorth netWorth) throws URISyntaxException {
        log.debug("REST request to update NetWorth : {}", netWorth);
        if (netWorth.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        NetWorth result = netWorthRepository.save(netWorth);
        netWorthSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, netWorth.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /net-worths} : get all the netWorths.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of netWorths in body.
     */
    @GetMapping("/net-worths")
    public List<NetWorth> getAllNetWorths() {
        log.debug("REST request to get all NetWorths");
        return netWorthRepository.findAll();
    }

    /**
     * {@code GET  /net-worths/:id} : get the "id" netWorth.
     *
     * @param id the id of the netWorth to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the netWorth, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/net-worths/{id}")
    public ResponseEntity<NetWorth> getNetWorth(@PathVariable Long id) {
        log.debug("REST request to get NetWorth : {}", id);
        Optional<NetWorth> netWorth = netWorthRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(netWorth);
    }

    /**
     * {@code DELETE  /net-worths/:id} : delete the "id" netWorth.
     *
     * @param id the id of the netWorth to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/net-worths/{id}")
    public ResponseEntity<Void> deleteNetWorth(@PathVariable Long id) {
        log.debug("REST request to delete NetWorth : {}", id);
        netWorthRepository.deleteById(id);
        netWorthSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/net-worths?query=:query} : search for the netWorth corresponding
     * to the query.
     *
     * @param query the query of the netWorth search.
     * @return the result of the search.
     */
    @GetMapping("/_search/net-worths")
    public List<NetWorth> searchNetWorths(@RequestParam String query) {
        log.debug("REST request to search NetWorths for query {}", query);
        return StreamSupport
            .stream(netWorthSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
