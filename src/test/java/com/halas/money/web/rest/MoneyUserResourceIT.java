package com.halas.money.web.rest;

import com.halas.money.JhipsterMoneyApp;
import com.halas.money.domain.MoneyUser;
import com.halas.money.repository.MoneyUserRepository;
import com.halas.money.repository.search.MoneyUserSearchRepository;
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
 * Integration tests for the {@Link MoneyUserResource} REST controller.
 */
@SpringBootTest(classes = JhipsterMoneyApp.class)
public class MoneyUserResourceIT {

    @Autowired
    private MoneyUserRepository moneyUserRepository;

    /**
     * This repository is mocked in the com.halas.money.repository.search test package.
     *
     * @see com.halas.money.repository.search.MoneyUserSearchRepositoryMockConfiguration
     */
    @Autowired
    private MoneyUserSearchRepository mockMoneyUserSearchRepository;

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

    private MockMvc restMoneyUserMockMvc;

    private MoneyUser moneyUser;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MoneyUserResource moneyUserResource = new MoneyUserResource(moneyUserRepository, mockMoneyUserSearchRepository);
        this.restMoneyUserMockMvc = MockMvcBuilders.standaloneSetup(moneyUserResource)
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
    public static MoneyUser createEntity(EntityManager em) {
        MoneyUser moneyUser = new MoneyUser();
        return moneyUser;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MoneyUser createUpdatedEntity(EntityManager em) {
        MoneyUser moneyUser = new MoneyUser();
        return moneyUser;
    }

    @BeforeEach
    public void initTest() {
        moneyUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createMoneyUser() throws Exception {
        int databaseSizeBeforeCreate = moneyUserRepository.findAll().size();

        // Create the MoneyUser
        restMoneyUserMockMvc.perform(post("/api/money-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(moneyUser)))
            .andExpect(status().isCreated());

        // Validate the MoneyUser in the database
        List<MoneyUser> moneyUserList = moneyUserRepository.findAll();
        assertThat(moneyUserList).hasSize(databaseSizeBeforeCreate + 1);
        MoneyUser testMoneyUser = moneyUserList.get(moneyUserList.size() - 1);

        // Validate the MoneyUser in Elasticsearch
        verify(mockMoneyUserSearchRepository, times(1)).save(testMoneyUser);
    }

    @Test
    @Transactional
    public void createMoneyUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = moneyUserRepository.findAll().size();

        // Create the MoneyUser with an existing ID
        moneyUser.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMoneyUserMockMvc.perform(post("/api/money-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(moneyUser)))
            .andExpect(status().isBadRequest());

        // Validate the MoneyUser in the database
        List<MoneyUser> moneyUserList = moneyUserRepository.findAll();
        assertThat(moneyUserList).hasSize(databaseSizeBeforeCreate);

        // Validate the MoneyUser in Elasticsearch
        verify(mockMoneyUserSearchRepository, times(0)).save(moneyUser);
    }


    @Test
    @Transactional
    public void getAllMoneyUsers() throws Exception {
        // Initialize the database
        moneyUserRepository.saveAndFlush(moneyUser);

        // Get all the moneyUserList
        restMoneyUserMockMvc.perform(get("/api/money-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(moneyUser.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getMoneyUser() throws Exception {
        // Initialize the database
        moneyUserRepository.saveAndFlush(moneyUser);

        // Get the moneyUser
        restMoneyUserMockMvc.perform(get("/api/money-users/{id}", moneyUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(moneyUser.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingMoneyUser() throws Exception {
        // Get the moneyUser
        restMoneyUserMockMvc.perform(get("/api/money-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMoneyUser() throws Exception {
        // Initialize the database
        moneyUserRepository.saveAndFlush(moneyUser);

        int databaseSizeBeforeUpdate = moneyUserRepository.findAll().size();

        // Update the moneyUser
        MoneyUser updatedMoneyUser = moneyUserRepository.findById(moneyUser.getId()).get();
        // Disconnect from session so that the updates on updatedMoneyUser are not directly saved in db
        em.detach(updatedMoneyUser);

        restMoneyUserMockMvc.perform(put("/api/money-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMoneyUser)))
            .andExpect(status().isOk());

        // Validate the MoneyUser in the database
        List<MoneyUser> moneyUserList = moneyUserRepository.findAll();
        assertThat(moneyUserList).hasSize(databaseSizeBeforeUpdate);
        MoneyUser testMoneyUser = moneyUserList.get(moneyUserList.size() - 1);

        // Validate the MoneyUser in Elasticsearch
        verify(mockMoneyUserSearchRepository, times(1)).save(testMoneyUser);
    }

    @Test
    @Transactional
    public void updateNonExistingMoneyUser() throws Exception {
        int databaseSizeBeforeUpdate = moneyUserRepository.findAll().size();

        // Create the MoneyUser

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMoneyUserMockMvc.perform(put("/api/money-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(moneyUser)))
            .andExpect(status().isBadRequest());

        // Validate the MoneyUser in the database
        List<MoneyUser> moneyUserList = moneyUserRepository.findAll();
        assertThat(moneyUserList).hasSize(databaseSizeBeforeUpdate);

        // Validate the MoneyUser in Elasticsearch
        verify(mockMoneyUserSearchRepository, times(0)).save(moneyUser);
    }

    @Test
    @Transactional
    public void deleteMoneyUser() throws Exception {
        // Initialize the database
        moneyUserRepository.saveAndFlush(moneyUser);

        int databaseSizeBeforeDelete = moneyUserRepository.findAll().size();

        // Delete the moneyUser
        restMoneyUserMockMvc.perform(delete("/api/money-users/{id}", moneyUser.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<MoneyUser> moneyUserList = moneyUserRepository.findAll();
        assertThat(moneyUserList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the MoneyUser in Elasticsearch
        verify(mockMoneyUserSearchRepository, times(1)).deleteById(moneyUser.getId());
    }

    @Test
    @Transactional
    public void searchMoneyUser() throws Exception {
        // Initialize the database
        moneyUserRepository.saveAndFlush(moneyUser);
        when(mockMoneyUserSearchRepository.search(queryStringQuery("id:" + moneyUser.getId())))
            .thenReturn(Collections.singletonList(moneyUser));
        // Search the moneyUser
        restMoneyUserMockMvc.perform(get("/api/_search/money-users?query=id:" + moneyUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(moneyUser.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MoneyUser.class);
        MoneyUser moneyUser1 = new MoneyUser();
        moneyUser1.setId(1L);
        MoneyUser moneyUser2 = new MoneyUser();
        moneyUser2.setId(moneyUser1.getId());
        assertThat(moneyUser1).isEqualTo(moneyUser2);
        moneyUser2.setId(2L);
        assertThat(moneyUser1).isNotEqualTo(moneyUser2);
        moneyUser1.setId(null);
        assertThat(moneyUser1).isNotEqualTo(moneyUser2);
    }
}
