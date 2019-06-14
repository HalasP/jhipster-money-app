package com.halas.money.repository.search;

import com.halas.money.domain.Liability;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Liability} entity.
 */
public interface LiabilitySearchRepository extends ElasticsearchRepository<Liability, Long> {
}
