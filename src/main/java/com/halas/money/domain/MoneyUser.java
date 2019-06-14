package com.halas.money.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A MoneyUser.
 */
@Entity
@Table(name = "money_user")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "moneyuser")
public class MoneyUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @OneToMany(mappedBy = "moneyUser")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<NetWorth> netWorths = new HashSet<>();

    @OneToMany(mappedBy = "moneyUser")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Liability> liabilities = new HashSet<>();

    @OneToMany(mappedBy = "moneyUser")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Asset> assets = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("moneyUsers")
    private User owner;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<NetWorth> getNetWorths() {
        return netWorths;
    }

    public MoneyUser netWorths(Set<NetWorth> netWorths) {
        this.netWorths = netWorths;
        return this;
    }

    public MoneyUser addNetWorth(NetWorth netWorth) {
        this.netWorths.add(netWorth);
        netWorth.setMoneyUser(this);
        return this;
    }

    public MoneyUser removeNetWorth(NetWorth netWorth) {
        this.netWorths.remove(netWorth);
        netWorth.setMoneyUser(null);
        return this;
    }

    public void setNetWorths(Set<NetWorth> netWorths) {
        this.netWorths = netWorths;
    }

    public Set<Liability> getLiabilities() {
        return liabilities;
    }

    public MoneyUser liabilities(Set<Liability> liabilities) {
        this.liabilities = liabilities;
        return this;
    }

    public MoneyUser addLiability(Liability liability) {
        this.liabilities.add(liability);
        liability.setMoneyUser(this);
        return this;
    }

    public MoneyUser removeLiability(Liability liability) {
        this.liabilities.remove(liability);
        liability.setMoneyUser(null);
        return this;
    }

    public void setLiabilities(Set<Liability> liabilities) {
        this.liabilities = liabilities;
    }

    public Set<Asset> getAssets() {
        return assets;
    }

    public MoneyUser assets(Set<Asset> assets) {
        this.assets = assets;
        return this;
    }

    public MoneyUser addAsset(Asset asset) {
        this.assets.add(asset);
        asset.setMoneyUser(this);
        return this;
    }

    public MoneyUser removeAsset(Asset asset) {
        this.assets.remove(asset);
        asset.setMoneyUser(null);
        return this;
    }

    public void setAssets(Set<Asset> assets) {
        this.assets = assets;
    }

    public User getOwner() {
        return owner;
    }

    public MoneyUser owner(User user) {
        this.owner = user;
        return this;
    }

    public void setOwner(User user) {
        this.owner = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MoneyUser)) {
            return false;
        }
        return id != null && id.equals(((MoneyUser) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "MoneyUser{" +
            "id=" + getId() +
            "}";
    }
}
