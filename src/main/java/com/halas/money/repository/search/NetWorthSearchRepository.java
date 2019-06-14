package com.halas.money.repository.search;

import com.halas.money.domain.NetWorth;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link NetWorth} entity.
 */
public interface NetWorthSearchRepository extends ElasticsearchRepository<NetWorth, Long> {
}
