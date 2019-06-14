package com.halas.money.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A NetWorth.
 */
@Entity
@Table(name = "net_worth")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "networth")
public class NetWorth implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "liabilities_amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal liabilitiesAmount;

    @NotNull
    @Column(name = "assets_amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal assetsAmount;

    @ManyToOne
    @JsonIgnoreProperties("netWorths")
    private MoneyUser moneyUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public NetWorth date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getLiabilitiesAmount() {
        return liabilitiesAmount;
    }

    public NetWorth liabilitiesAmount(BigDecimal liabilitiesAmount) {
        this.liabilitiesAmount = liabilitiesAmount;
        return this;
    }

    public void setLiabilitiesAmount(BigDecimal liabilitiesAmount) {
        this.liabilitiesAmount = liabilitiesAmount;
    }

    public BigDecimal getAssetsAmount() {
        return assetsAmount;
    }

    public NetWorth assetsAmount(BigDecimal assetsAmount) {
        this.assetsAmount = assetsAmount;
        return this;
    }

    public void setAssetsAmount(BigDecimal assetsAmount) {
        this.assetsAmount = assetsAmount;
    }

    public MoneyUser getMoneyUser() {
        return moneyUser;
    }

    public NetWorth moneyUser(MoneyUser moneyUser) {
        this.moneyUser = moneyUser;
        return this;
    }

    public void setMoneyUser(MoneyUser moneyUser) {
        this.moneyUser = moneyUser;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NetWorth)) {
            return false;
        }
        return id != null && id.equals(((NetWorth) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "NetWorth{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", liabilitiesAmount=" + getLiabilitiesAmount() +
            ", assetsAmount=" + getAssetsAmount() +
            "}";
    }
}
