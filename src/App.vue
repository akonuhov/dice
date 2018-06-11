<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form ref="formDice" :model="formDice" label-position="top">
            <el-form-item label="Bet Amount">
              <el-input-number v-model="formDice.betAmount" :precision="2" :min="0.1" @change="onChangeBetAmount"></el-input-number>
            </el-form-item>
            <el-form-item label="Number">
              <el-input-number v-model="formDice.number" :min="1" :max="99"></el-input-number>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button type="primary" icon="el-icon-caret-top" :disabled="disabledBetBtn" @click="onClickBet('hi', payoutHi)">Bet Hi</el-button>
                <p>Number &#8805; {{ this.formDice.number }}</p>
                <p>Chance: {{ getChanceValueHi }}%</p>
                <p>Payout: {{ getPayoutValueHi }}x</p>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" icon="el-icon-caret-bottom" :disabled="disabledBetBtn" @click="onClickBet('lo', payoutLo)">Bet Lo</el-button>
                <p>Number &#8804; {{ this.formDice.number }}</p>
                <p>Chance: {{ getChanceValueLo }}%</p>
                <p>Payout: {{ getPayoutValueLo }}x</p>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="6">
          <p class="balance">Balance: {{ getBalanceValue }} credits</p>
          <el-button :disabled="disabledCreditsBtn" @click="onClickFreeCredits">Free Credits</el-button>
          <div class="hash" v-if="getHash">
            <h3>Provably Fair Hash</h3>
            <p>{{ getHash }}</p>
          </div>
          <div class="result" v-if="getResult">
            <h3>Result</h3>
            <p>{{ getResult }} {{ getStatus ? 'Win' : 'Lose' }}</p>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import getRandomValue from './utils/random-value'
import onBet from './utils/bet'
import getHash from './utils/hash'
import { setLocalStorage, getLocalStorage } from './utils/local-storage'
export default {
  name: 'App',
  data () {
    return {
      balance: 0,
      formDice: {
        betAmount: 0.1,
        number: 50
      },
      payoutHi: 2,
      payoutLo: 2,
      chanceHi: 50,
      chanceLo: 50,
      randomValue: null,
      hash: null,
      randomValueMin: 1,
      randomValueMax: 100,
      statusBet: false,
      disabledCreditsBtn: false,
      disabledBetBtn: true
    }
  },
  watch: {
    balance (value) {
      if (value === 0.00) {
        this.disabledCreditsBtn = false
        this.disabledBetBtn = true
      } else {
        this.disabledCreditsBtn = true
        this.disabledBetBtn = false
      }
      setLocalStorage({
        'dice': {
          'balance': value,
          'betAmount': this.formDice.betAmount,
          'number': this.formDice.number
        }
      })
    }
  },
  created () {
    if (getLocalStorage()) {
      const diceObject = getLocalStorage()
      this.balance = diceObject.dice.balance
      this.formDice.betAmount = diceObject.dice.betAmount
      this.formDice.number = diceObject.dice.number
    }
  },
  computed: {
    getBalanceValue () {
      return this.balance
    },
    getChanceValueHi () {
      return this.chanceHi
    },
    getChanceValueLo () {
      return this.chanceLo
    },
    getPayoutValueHi () {
      return this.payoutHi
    },
    getPayoutValueLo () {
      return this.payoutLo
    },
    getResult () {
      return this.randomValue
    },
    getHash () {
      return this.hash
    },
    getStatus () {
      return this.statusBet
    }
  },
  methods: {
    onChangeNumber () {
      this.chanceHi = Math.round((100 - this.formDice.number) * 10) / 10
      this.chanceLo = this.formDice.number
      this.payoutHi = Math.round((100 / this.chanceHi) * 10) / 10
      this.payoutLo = Math.round((100 / this.chanceLo) * 10) / 10
    },
    onClickFreeCredits () {
      this.balance = 100
    },
    onClickBet (bet, payout) {
      if (this.formDice.betAmount > this.balance) {
        this.$message({
          message: 'Bet amount can not exceed balance.',
          type: 'warning'
        })
      } else {
        this.randomValue = getRandomValue(this.randomValueMin, this.randomValueMax)
        this.hash = getHash(this.randomValue)
        this.statusBet = onBet(this.formDice.number, this.randomValue, bet)
        if (this.statusBet === true) {
          this.balance = Math.round((this.balance + (this.formDice.betAmount * payout)) * 100) / 100
        } else {
          this.balance = Math.round((this.balance - this.formDice.betAmount) * 100) / 100
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "/assets/scss/index";
.balance {
  margin-bottom: 10px;
  font-size: 16px;
}
.hash {
  margin: 10px 0;
}
.el-form {
  &-item {
    &__label {
      font-size: 16px;
      line-height: normal;
    }
    .el-input-number {
      width: 100%;
    }
  }
  .el-button--primary {
    margin-bottom: 10px;
    width: 100%;
  }
}
</style>
