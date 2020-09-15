<template>
  <tc-modal
    class="fh-run-workout"
    :dark="$store.getters.darkmode"
    :closable="false"
    v-model="modalOpened"
  >
    <div class="modal-head">
      <img
        src="https://www.welcomewildlife.com/wp-content/uploads/2015/01/Raccoon-face.jpg"
        alt=""
      />
      <div class="container">
        <div class="subtitle">Aktuelle Übung</div>
        <div class="title">Bizeps Curls</div>
      </div>
      <div class="totalTime">
        <i class="ti-clock-simple" />
        <span>1h 5m</span>
      </div>
    </div>
    <div class="current-exercise">
      <tl-flow class="head" flow="column">
        <div class="current-time">Zeit für diese Übung</div>
        <div class="time">04:38</div>
      </tl-flow>
      <tc-divider :dark="$store.getters.darkmode" />
      <div class="completed-sets">
        <div class="set">
          <div class="index">Set 1</div>
          <div class="unit">
            <div class="amount">20</div>
            <div class="description">Reps</div>
          </div>
          <div class="x"><i class="ti-cross" /></div>
          <div class="unit">
            <div class="amount">30</div>
            <div class="description">Kg</div>
          </div>
        </div>
        <div class="set">
          <div class="index">Set 2</div>
          <div class="unit">
            <div class="amount">20</div>
            <div class="description">Reps</div>
          </div>
          <div class="x"><i class="ti-cross" /></div>
          <div class="unit">
            <div class="amount">30</div>
            <div class="description">Kg</div>
          </div>
        </div>
      </div>
    </div>
    <div class="enter-new-set">
      <div class="title">Weitere Wiederholung</div>
      <div class="container">
        <tc-input
          :dark="$store.getters.darkmode"
          title="Reps"
          :value="1"
          type="number"
          :buttons="true"
        />
        <tc-input
          :dark="$store.getters.darkmode"
          title="Kg"
          min="0"
          type="number"
          :buttons="true"
        />
        <div class="button">
          <tc-button tfbackground="success" variant="filled" icon="plus" />
        </div>
      </div>
    </div>
    <div class="next-exercise">
      <div class="title">Nächste Übung</div>
      <div class="container">
        <div class="preview">
          <img
            src="https://www.welcomewildlife.com/wp-content/uploads/2015/01/Raccoon-face.jpg"
            alt=""
          />
        </div>
        <div class="amount">
          <span>4</span>
          <span>x</span>
          <span>12</span>
        </div>
        <div class="title">Waschbär kraulen</div>
      </div>
    </div>
    <tl-grid minWidth="100" gap="0 15" slot="footer">
      <tc-button name="Workout beenden" tfbackground="alarm" variant="opaque" />
      <tc-button name="Nächste Übung" tfbackground="success" variant="opaque" />
    </tl-grid>
  </tc-modal>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FHRunWorkout extends Vue {
  public modalOpened = false;
}
</script>

<style lang="scss" scoped>
.fh-run-workout {
  /deep/ .tc-modal--head__prestyled {
    display: none;
  }
  .enter-new-set {
    width: 350px;
    max-width: 100%;
    user-select: none;
    margin-top: 20px;
    .title {
      font-weight: bold;
      font-size: 14px;
      opacity: 0.75;
    }
    .container {
      display: grid;
      grid-template-columns: minmax(0px, 1fr) minmax(0px, 1fr) auto;
      .button {
        display: grid;
        place-content: end;
      }
    }
  }
  .current-exercise {
    user-select: none;
    .completed-sets {
      display: grid;
      grid-gap: 10px;
      .set {
        display: grid;
        grid-template-columns: 1fr auto 20px auto;
        grid-gap: 20px 10px;
        .index {
          display: grid;
          place-content: center start;
          text-transform: uppercase;
          font-size: 14px;
          opacity: 0.75;
        }
        .x {
          display: grid;
          place-content: center;
          font-weight: bold;
          font-size: 12px;
        }
        .unit {
          display: flex;
          flex-direction: column;
          .amount {
            font-size: 1.4em;
            font-weight: bold;
          }
          .description {
            opacity: 0.75;
          }
        }
      }
    }
    .head {
      .current-time {
        margin-top: 10px;
        font-size: 1.2em;
        font-weight: 500;
        opacity: 0.75;
      }
      .time {
        font-size: 2em;
        font-weight: bold;
      }
    }
  }
  .next-exercise {
    user-select: none;
    margin-bottom: 20px;
    @media only screen and (min-width: 650px) {
      margin: 0 calc(-5vw + 20px);
    }
    & > .title {
      margin: 20px 0 5px;
      font-weight: 600;
      opacity: 0.75;
    }
    .container {
      $scale: 50px;
      display: grid;
      grid-template-columns: $scale auto 1fr;
      grid-gap: 10px;
      padding: 5px;
      border-radius: $border-radius;
      background: $container;
      @media (prefers-color-scheme: dark) {
        background: $container_dark;
      }

      .preview {
        width: $scale;
        height: $scale;
        img {
          width: 100%;
          height: 100%;
          border-radius: $border-radius;
          object-fit: cover;
        }
      }
      .amount {
        display: flex;
        justify-content: center;
        align-items: center;
        span:nth-child(ODD) {
          font-weight: bold;
          font-size: 1.1em;
        }
      }
      .title {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;
      }
    }
  }
  .modal-head {
    user-select: none;
    width: calc(100% + 10vw);
    margin-left: -5vw;
    height: 150px;
    position: relative;
    border-radius: 20px;

    .container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-weight: 500;
      text-align: center;
      .subtitle {
        font-size: 0.8em;
        opacity: 0.75;
      }
      .title {
        font-size: 1.3em;
      }
    }
    .totalTime {
      top: 20px;
      left: 20px;
      position: absolute;
      i {
        margin-right: 5px;
      }
    }
    img {
      filter: brightness(50%);
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
    }
  }
}
</style>
