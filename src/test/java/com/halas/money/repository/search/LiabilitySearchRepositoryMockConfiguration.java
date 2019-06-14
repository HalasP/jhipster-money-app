package com.halas.money.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link LiabilitySearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class LiabilitySearchRepositoryMockConfiguration {

    @MockBean
    private LiabilitySearchRepository mockLiabilitySearchRepository;

}
