package com.halas.money.repository.search;

import com.halas.money.domain.MoneyUser;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link MoneyUser} entity.
 */
public interface MoneyUserSearchRepository extends ElasticsearchRepository<MoneyUser, Long> {
}
