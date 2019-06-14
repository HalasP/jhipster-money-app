package com.halas.money.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link AssetSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class AssetSearchRepositoryMockConfiguration {

    @MockBean
    private AssetSearchRepository mockAssetSearchRepository;

}
