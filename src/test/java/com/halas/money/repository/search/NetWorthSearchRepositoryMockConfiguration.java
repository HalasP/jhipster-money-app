package com.halas.money.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link NetWorthSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class NetWorthSearchRepositoryMockConfiguration {

    @MockBean
    private NetWorthSearchRepository mockNetWorthSearchRepository;

}
