package com.halas.money.web.rest;

import com.halas.money.JhipsterMoneyApp;
import com.halas.money.domain.Liability;
import com.halas.money.repository.LiabilityRepository;
import com.halas.money.repository.search.LiabilitySearchRepository;
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
 * Integration tests for the {@Link LiabilityResource} REST controller.
 */
@SpringBootTest(classes = JhipsterMoneyApp.class)
public class LiabilityResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    @Autowired
    private LiabilityRepository liabilityRepository;

    /**
     * This repository is mocked in the com.halas.money.repository.search test package.
     *
     * @see com.halas.money.repository.search.LiabilitySearchRepositoryMockConfiguration
     */
    @Autowired
    private LiabilitySearchRepository mockLiabilitySearchRepository;

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

    private MockMvc restLiabilityMockMvc;

    private Liability liability;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LiabilityResource liabilityResource = new LiabilityResource(liabilityRepository, mockLiabilitySearchRepository);
        this.restLiabilityMockMvc = MockMvcBuilders.standaloneSetup(liabilityResource)
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
    public static Liability createEntity(EntityManager em) {
        Liability liability = new Liability()
            .date(DEFAULT_DATE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .amount(DEFAULT_AMOUNT);
        return liability;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Liability createUpdatedEntity(EntityManager em) {
        Liability liability = new Liability()
            .date(UPDATED_DATE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT);
        return liability;
    }

    @BeforeEach
    public void initTest() {
        liability = createEntity(em);
    }

    @Test
    @Transactional
    public void createLiability() throws Exception {
        int databaseSizeBeforeCreate = liabilityRepository.findAll().size();

        // Create the Liability
        restLiabilityMockMvc.perform(post("/api/liabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(liability)))
            .andExpect(status().isCreated());

        // Validate the Liability in the database
        List<Liability> liabilityList = liabilityRepository.findAll();
        assertThat(liabilityList).hasSize(databaseSizeBeforeCreate + 1);
        Liability testLiability = liabilityList.get(liabilityList.size() - 1);
        assertThat(testLiability.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testLiability.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLiability.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLiability.getAmount()).isEqualTo(DEFAULT_AMOUNT);

        // Validate the Liability in Elasticsearch
        verify(mockLiabilitySearchRepository, times(1)).save(testLiability);
    }

    @Test
    @Transactional
    public void createLiabilityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = liabilityRepository.findAll().size();

        // Create the Liability with an existing ID
        liability.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLiabilityMockMvc.perform(post("/api/liabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(liability)))
            .andExpect(status().isBadRequest());

        // Validate the Liability in the database
        List<Liability> liabilityList = liabilityRepository.findAll();
        assertThat(liabilityList).hasSize(databaseSizeBeforeCreate);

        // Validate the Liability in Elasticsearch
        verify(mockLiabilitySearchRepository, times(0)).save(liability);
    }


    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = liabilityRepository.findAll().size();
        // set the field null
        liability.setDate(null);

        // Create the Liability, which fails.

        restLiabilityMockMvc.perform(post("/api/liabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(liability)))
            .andExpect(status().isBadRequest());

        List<Liability> liabilityList = liabilityRepository.findAll();
        assertThat(liabilityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = liabilityRepository.findAll().size();
        // set the field null
        liability.setName(null);

        // Create the Liability, which fails.

        restLiabilityMockMvc.perform(post("/api/liabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(liability)))
            .andExpect(status().isBadRequest());

        List<Liability> liabilityList = liabilityRepository.findAll();
        assertThat(liabilityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = liabilityRepository.findAll().size();
        // set the field null
        liability.setAmount(null);

        // Create the Liability, which fails.

        restLiabilityMockMvc.perform(post("/api/liabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(liability)))
            .andExpect(status().isBadRequest());

        List<Liability> liabilityList = liabilityRepository.findAll();
        assertThat(liabilityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLiabilities() throws Exception {
        // Initialize the database
        liabilityRepository.saveAndFlush(liability);

        // Get all the liabilityList
        restLiabilityMockMvc.perform(get("/api/liabilities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(liability.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.intValue())));
    }
    
    @Test
    @Transactional
    public void getLiability() throws Exception {
        // Initialize the database
        liabilityRepository.saveAndFlush(liability);

        // Get the liability
        restLiabilityMockMvc.perform(get("/api/liabilities/{id}", liability.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(liability.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingLiability() throws Exception {
        // Get the liability
        restLiabilityMockMvc.perform(get("/api/liabilities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLiability() throws Exception {
        // Initialize the database
        liabilityRepository.saveAndFlush(liability);

        int databaseSizeBeforeUpdate = liabilityRepository.findAll().size();

        // Update the liability
        Liability updatedLiability = liabilityRepository.findById(liability.getId()).get();
        // Disconnect from session so that the updates on updatedLiability are not directly saved in db
        em.detach(updatedLiability);
        updatedLiability
            .date(UPDATED_DATE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .amount(UPDATED_AMOUNT);

        restLiabilityMockMvc.perform(put("/api/liabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLiability)))
            .andExpect(status().isOk());

        // Validate the Liability in the database
        List<Liability> liabilityList = liabilityRepository.findAll();
        assertThat(liabilityList).hasSize(databaseSizeBeforeUpdate);
        Liability testLiability = liabilityList.get(liabilityList.size() - 1);
        assertThat(testLiability.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testLiability.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLiability.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLiability.getAmount()).isEqualTo(UPDATED_AMOUNT);

        // Validate the Liability in Elasticsearch
        verify(mockLiabilitySearchRepository, times(1)).save(testLiability);
    }

    @Test
    @Transactional
    public void updateNonExistingLiability() throws Exception {
        int databaseSizeBeforeUpdate = liabilityRepository.findAll().size();

        // Create the Liability

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLiabilityMockMvc.perform(put("/api/liabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(liability)))
            .andExpect(status().isBadRequest());

        // Validate the Liability in the database
        List<Liability> liabilityList = liabilityRepository.findAll();
        assertThat(liabilityList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Liability in Elasticsearch
        verify(mockLiabilitySearchRepository, times(0)).save(liability);
    }

    @Test
    @Transactional
    public void deleteLiability() throws Exception {
        // Initialize the database
        liabilityRepository.saveAndFlush(liability);

        int databaseSizeBeforeDelete = liabilityRepository.findAll().size();

        // Delete the liability
        restLiabilityMockMvc.perform(delete("/api/liabilities/{id}", liability.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<Liability> liabilityList = liabilityRepository.findAll();
        assertThat(liabilityList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Liability in Elasticsearch
        verify(mockLiabilitySearchRepository, times(1)).deleteById(liability.getId());
    }

    @Test
    @Transactional
    public void searchLiability() throws Exception {
        // Initialize the database
        liabilityRepository.saveAndFlush(liability);
        when(mockLiabilitySearchRepository.search(queryStringQuery("id:" + liability.getId())))
            .thenReturn(Collections.singletonList(liability));
        // Search the liability
        restLiabilityMockMvc.perform(get("/api/_search/liabilities?query=id:" + liability.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(liability.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Liability.class);
        Liability liability1 = new Liability();
        liability1.setId(1L);
        Liability liability2 = new Liability();
        liability2.setId(liability1.getId());
        assertThat(liability1).isEqualTo(liability2);
        liability2.setId(2L);
        assertThat(liability1).isNotEqualTo(liability2);
        liability1.setId(null);
        assertThat(liability1).isNotEqualTo(liability2);
    }
}
