package com.halas.money.web.rest;

import com.halas.money.domain.Asset;
import com.halas.money.repository.AssetRepository;
import com.halas.money.repository.search.AssetSearchRepository;
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
 * REST controller for managing {@link com.halas.money.domain.Asset}.
 */
@RestController
@RequestMapping("/api")
public class AssetResource {

    private final Logger log = LoggerFactory.getLogger(AssetResource.class);

    private static final String ENTITY_NAME = "asset";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AssetRepository assetRepository;

    private final AssetSearchRepository assetSearchRepository;

    public AssetResource(AssetRepository assetRepository, AssetSearchRepository assetSearchRepository) {
        this.assetRepository = assetRepository;
        this.assetSearchRepository = assetSearchRepository;
    }

    /**
     * {@code POST  /assets} : Create a new asset.
     *
     * @param asset the asset to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new asset, or with status {@code 400 (Bad Request)} if the asset has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/assets")
    public ResponseEntity<Asset> createAsset(@Valid @RequestBody Asset asset) throws URISyntaxException {
        log.debug("REST request to save Asset : {}", asset);
        if (asset.getId() != null) {
            throw new BadRequestAlertException("A new asset cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Asset result = assetRepository.save(asset);
        assetSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/assets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /assets} : Updates an existing asset.
     *
     * @param asset the asset to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated asset,
     * or with status {@code 400 (Bad Request)} if the asset is not valid,
     * or with status {@code 500 (Internal Server Error)} if the asset couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/assets")
    public ResponseEntity<Asset> updateAsset(@Valid @RequestBody Asset asset) throws URISyntaxException {
        log.debug("REST request to update Asset : {}", asset);
        if (asset.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Asset result = assetRepository.save(asset);
        assetSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, asset.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /assets} : get all the assets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of assets in body.
     */
    @GetMapping("/assets")
    public List<Asset> getAllAssets() {
        log.debug("REST request to get all Assets");
        return assetRepository.findAll();
    }

    /**
     * {@code GET  /assets/:id} : get the "id" asset.
     *
     * @param id the id of the asset to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the asset, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/assets/{id}")
    public ResponseEntity<Asset> getAsset(@PathVariable Long id) {
        log.debug("REST request to get Asset : {}", id);
        Optional<Asset> asset = assetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(asset);
    }

    /**
     * {@code DELETE  /assets/:id} : delete the "id" asset.
     *
     * @param id the id of the asset to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/assets/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        log.debug("REST request to delete Asset : {}", id);
        assetRepository.deleteById(id);
        assetSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/assets?query=:query} : search for the asset corresponding
     * to the query.
     *
     * @param query the query of the asset search.
     * @return the result of the search.
     */
    @GetMapping("/_search/assets")
    public List<Asset> searchAssets(@RequestParam String query) {
        log.debug("REST request to search Assets for query {}", query);
        return StreamSupport
            .stream(assetSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
