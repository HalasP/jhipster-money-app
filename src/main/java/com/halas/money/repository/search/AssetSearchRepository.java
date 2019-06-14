package com.halas.money.repository.search;

import com.halas.money.domain.Asset;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Asset} entity.
 */
public interface AssetSearchRepository extends ElasticsearchRepository<Asset, Long> {
}
