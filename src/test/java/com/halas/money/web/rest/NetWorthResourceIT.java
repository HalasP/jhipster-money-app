package com.halas.money.web.rest;

import com.halas.money.JhipsterMoneyApp;
import com.halas.money.domain.NetWorth;
import com.halas.money.repository.NetWorthRepository;
import com.halas.money.repository.search.NetWorthSearchRepository;
import com.halas.money.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static com.halas.money.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link NetWorthResource} REST controller.
 */
@SpringBootTest(classes = JhipsterMoneyApp.class)
public class NetWorthResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_LIABILITIES_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_LIABILITIES_AMOUNT = new BigDecimal(2);

    private static final BigDecimal DEFAULT_ASSETS_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_ASSETS_AMOUNT = new BigDecimal(2);

    @Autowired
    private NetWorthRepository netWorthRepository;

    /**
     * This repository is mocked in the com.halas.money.repository.search test package.
     *
     * @see com.halas.money.repository.search.NetWorthSearchRepositoryMockConfiguration
     */
    @Autowired
    private NetWorthSearchRepository mockNetWorthSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restNetWorthMockMvc;

    private NetWorth netWorth;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NetWorthResource netWorthResource = new NetWorthResource(netWorthRepository, mockNetWorthSearchRepository);
        this.restNetWorthMockMvc = MockMvcBuilders.standaloneSetup(netWorthResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NetWorth createEntity(EntityManager em) {
        NetWorth netWorth = new NetWorth()
            .date(DEFAULT_DATE)
            .liabilitiesAmount(DEFAULT_LIABILITIES_AMOUNT)
            .assetsAmount(DEFAULT_ASSETS_AMOUNT);
        return netWorth;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NetWorth createUpdatedEntity(EntityManager em) {
        NetWorth netWorth = new NetWorth()
            .date(UPDATED_DATE)
            .liabilitiesAmount(UPDATED_LIABILITIES_AMOUNT)
            .assetsAmount(UPDATED_ASSETS_AMOUNT);
        return netWorth;
    }

    @BeforeEach
    public void initTest() {
        netWorth = createEntity(em);
    }

    @Test
    @Transactional
    public void createNetWorth() throws Exception {
        int databaseSizeBeforeCreate = netWorthRepository.findAll().size();

        // Create the NetWorth
        restNetWorthMockMvc.perform(post("/api/net-worths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(netWorth)))
            .andExpect(status().isCreated());

        // Validate the NetWorth in the database
        List<NetWorth> netWorthList = netWorthRepository.findAll();
        assertThat(netWorthList).hasSize(databaseSizeBeforeCreate + 1);
        NetWorth testNetWorth = netWorthList.get(netWorthList.size() - 1);
        assertThat(testNetWorth.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testNetWorth.getLiabilitiesAmount()).isEqualTo(DEFAULT_LIABILITIES_AMOUNT);
        assertThat(testNetWorth.getAssetsAmount()).isEqualTo(DEFAULT_ASSETS_AMOUNT);

        // Validate the NetWorth in Elasticsearch
        verify(mockNetWorthSearchRepository, times(1)).save(testNetWorth);
    }

    @Test
    @Transactional
    public void createNetWorthWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = netWorthRepository.findAll().size();

        // Create the NetWorth with an existing ID
        netWorth.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restNetWorthMockMvc.perform(post("/api/net-worths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(netWorth)))
            .andExpect(status().isBadRequest());

        // Validate the NetWorth in the database
        List<NetWorth> netWorthList = netWorthRepository.findAll();
        assertThat(netWorthList).hasSize(databaseSizeBeforeCreate);

        // Validate the NetWorth in Elasticsearch
        verify(mockNetWorthSearchRepository, times(0)).save(netWorth);
    }


    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = netWorthRepository.findAll().size();
        // set the field null
        netWorth.setDate(null);

        // Create the NetWorth, which fails.

        restNetWorthMockMvc.perform(post("/api/net-worths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(netWorth)))
            .andExpect(status().isBadRequest());

        List<NetWorth> netWorthList = netWorthRepository.findAll();
        assertThat(netWorthList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLiabilitiesAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = netWorthRepository.findAll().size();
        // set the field null
        netWorth.setLiabilitiesAmount(null);

        // Create the NetWorth, which fails.

        restNetWorthMockMvc.perform(post("/api/net-worths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(netWorth)))
            .andExpect(status().isBadRequest());

        List<NetWorth> netWorthList = netWorthRepository.findAll();
        assertThat(netWorthList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAssetsAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = netWorthRepository.findAll().size();
        // set the field null
        netWorth.setAssetsAmount(null);

        // Create the NetWorth, which fails.

        restNetWorthMockMvc.perform(post("/api/net-worths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(netWorth)))
            .andExpect(status().isBadRequest());

        List<NetWorth> netWorthList = netWorthRepository.findAll();
        assertThat(netWorthList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllNetWorths() throws Exception {
        // Initialize the database
        netWorthRepository.saveAndFlush(netWorth);

        // Get all the netWorthList
        restNetWorthMockMvc.perform(get("/api/net-worths?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(netWorth.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].liabilitiesAmount").value(hasItem(DEFAULT_LIABILITIES_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].assetsAmount").value(hasItem(DEFAULT_ASSETS_AMOUNT.intValue())));
    }
    
    @Test
    @Transactional
    public void getNetWorth() throws Exception {
        // Initialize the database
        netWorthRepository.saveAndFlush(netWorth);

        // Get the netWorth
        restNetWorthMockMvc.perform(get("/api/net-worths/{id}", netWorth.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(netWorth.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.liabilitiesAmount").value(DEFAULT_LIABILITIES_AMOUNT.intValue()))
            .andExpect(jsonPath("$.assetsAmount").value(DEFAULT_ASSETS_AMOUNT.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingNetWorth() throws Exception {
        // Get the netWorth
        restNetWorthMockMvc.perform(get("/api/net-worths/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateNetWorth() throws Exception {
        // Initialize the database
        netWorthRepository.saveAndFlush(netWorth);

        int databaseSizeBeforeUpdate = netWorthRepository.findAll().size();

        // Update the netWorth
        NetWorth updatedNetWorth = netWorthRepository.findById(netWorth.getId()).get();
        // Disconnect from session so that the updates on updatedNetWorth are not directly saved in db
        em.detach(updatedNetWorth);
        updatedNetWorth
            .date(UPDATED_DATE)
            .liabilitiesAmount(UPDATED_LIABILITIES_AMOUNT)
            .assetsAmount(UPDATED_ASSETS_AMOUNT);

        restNetWorthMockMvc.perform(put("/api/net-worths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedNetWorth)))
            .andExpect(status().isOk());

        // Validate the NetWorth in the database
        List<NetWorth> netWorthList = netWorthRepository.findAll();
        assertThat(netWorthList).hasSize(databaseSizeBeforeUpdate);
        NetWorth testNetWorth = netWorthList.get(netWorthList.size() - 1);
        assertThat(testNetWorth.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testNetWorth.getLiabilitiesAmount()).isEqualTo(UPDATED_LIABILITIES_AMOUNT);
        assertThat(testNetWorth.getAssetsAmount()).isEqualTo(UPDATED_ASSETS_AMOUNT);

        // Validate the NetWorth in Elasticsearch
        verify(mockNetWorthSearchRepository, times(1)).save(testNetWorth);
    }

    @Test
    @Transactional
    public void updateNonExistingNetWorth() throws Exception {
        int databaseSizeBeforeUpdate = netWorthRepository.findAll().size();

        // Create the NetWorth

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNetWorthMockMvc.perform(put("/api/net-worths")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(netWorth)))
            .andExpect(status().isBadRequest());

        // Validate the NetWorth in the database
        List<NetWorth> netWorthList = netWorthRepository.findAll();
        assertThat(netWorthList).hasSize(databaseSizeBeforeUpdate);

        // Validate the NetWorth in Elasticsearch
        verify(mockNetWorthSearchRepository, times(0)).save(netWorth);
    }

    @Test
    @Transactional
    public void deleteNetWorth() throws Exception {
        // Initialize the database
        netWorthRepository.saveAndFlush(netWorth);

        int databaseSizeBeforeDelete = netWorthRepository.findAll().size();

        // Delete the netWorth
        restNetWorthMockMvc.perform(delete("/api/net-worths/{id}", netWorth.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<NetWorth> netWorthList = netWorthRepository.findAll();
        assertThat(netWorthList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the NetWorth in Elasticsearch
        verify(mockNetWorthSearchRepository, times(1)).deleteById(netWorth.getId());
    }

    @Test
    @Transactional
    public void searchNetWorth() throws Exception {
        // Initialize the database
        netWorthRepository.saveAndFlush(netWorth);
        when(mockNetWorthSearchRepository.search(queryStringQuery("id:" + netWorth.getId())))
            .thenReturn(Collections.singletonList(netWorth));
        // Search the netWorth
        restNetWorthMockMvc.perform(get("/api/_search/net-worths?query=id:" + netWorth.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(netWorth.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].liabilitiesAmount").value(hasItem(DEFAULT_LIABILITIES_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].assetsAmount").value(hasItem(DEFAULT_ASSETS_AMOUNT.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NetWorth.class);
        NetWorth netWorth1 = new NetWorth();
        netWorth1.setId(1L);
        NetWorth netWorth2 = new NetWorth();
        netWorth2.setId(netWorth1.getId());
        assertThat(netWorth1).isEqualTo(netWorth2);
        netWorth2.setId(2L);
        assertThat(netWorth1).isNotEqualTo(netWorth2);
        netWorth1.setId(null);
        assertThat(netWorth1).isNotEqualTo(netWorth2);
    }
}
