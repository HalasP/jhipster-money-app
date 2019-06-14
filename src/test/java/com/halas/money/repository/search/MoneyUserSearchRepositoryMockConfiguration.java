package com.halas.money.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link MoneyUserSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class MoneyUserSearchRepositoryMockConfiguration {

    @MockBean
    private MoneyUserSearchRepository mockMoneyUserSearchRepository;

}
