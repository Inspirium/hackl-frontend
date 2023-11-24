<template>
  <div v-if="true" class="builder">
    <template v-if="true">
      <div class="m-b-20">
        <div
          v-for="(item, index) in options.documents"
          :key="index"
          class="list__documents list__image-col softshadow m-b-10"
        >
          <div class="align__centar__y w100 document-list">
            <div class="m-r-10 m-t-10">
              <b-icon icon="file" size="is-larger" type="is-grey" pack="fal"></b-icon>
            </div>
            <div class="list__content m-r-auto doc-icons">
              <h3 class="fw600 m-b-5">{{ item.title }}</h3>
            </div>
            <div class="m-l-auto m-t-10" @click="deleteDocument(item.id)">
              <b-icon icon="times-circle" size="is-larger" type="is-danger" pack="fal"></b-icon>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="file === null">
      <div class="empty__box">
        <b-field>
          <b-field class="file is-primary">
            <b-upload v-model="file" class="file-label" rounded>
              <span class="file-cta">
                <b-icon icon="upload"></b-icon>
                <span class="file-label">{{ $t('Unesi dokument') }}</span>
              </span>
            </b-upload>
          </b-field>
        </b-field>
      </div>
    </template>

    <div>
      <div class="my-rank p-all-0">
        <!--<template v-if="false">
          <div v-for="(item, index) in options.liga.documents" :key="index" class="list__image-col softshadow m-b-10">
            <div class="align__centar__y w100 document-list">
              <div class="m-r-10 m-t-10">
                <b-icon icon="file" size="is-larger" type="is-grey" pack="fal"></b-icon>
              </div>
              <div class="list__content m-r-auto doc-icons">
                <h3 class="fw600 m-b-5">{{ item.title }}</h3>
              </div>
              <div class="m-l-auto m-t-10" @click="deleteDocument(item.id)">
                <b-icon icon="times-circle" size="is-larger" type="is-danger" pack="fal"></b-icon>
              </div>
            </div>
          </div>
        </template>-->
        <template v-if="file !== null">
          <h5>{{ $t('noviDokument') }}</h5>
          <div class="list__image-col softshadow">
            <div class="align__centar__y w100">
              <div class="m-r-10 m-t-10">
                <b-icon icon="file" size="is-larger" type="is-grey" pack="fal"></b-icon>
              </div>
              <div class="list__content m-r-auto doc-icons">
                <h3 v-if="title === ''" class="fw600 m-b-5" :class="[title === '' ? 'has-text-black20' : '']">
                  {{ file ? file.name : $t('naziv dokumenta') }}
                </h3>
                <h3 v-else class="fw600 m-b-5" :class="[title === '' ? 'has-text-black20' : '']">
                  {{ title }}
                </h3>
              </div>
              <div
                class="m-l-auto m-t-10"
                @click="
                  file = null
                  title = ''
                "
              >
                <b-icon icon="times-circle" size="is-larger" type="is-danger" pack="fal"></b-icon>
              </div>
            </div>
          </div>
          <b-field class="has-text-centered m-t-20">
            <b-input
              v-model="title"
              wrap="hard"
              custom-class="input__title"
              :placeholder="$t('upiiNazivDokumenta')"
            ></b-input>
          </b-field>
        </template>
      </div>
    </div>
    <div v-if="file !== null" class="buttons m-t-30">
      <b-button
        class="fw600"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        :loading="loading"
        @click.prevent="uploadDocument()"
      >
        {{ $t('spremiDokument') }}
      </b-button>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import League from '@/models/League'
import Tournament from '@/models/Tournament'
import Document from '@/models/Document'

export default {
  name: 'Document',
  props: {
    options: {
      type: Object,
      required: true,
      default() {},
    },
    type: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      file: null,
      title: '',
      documents: [],
      loading: false,
    }
  },
  methods: {
    uploadDocument() {
      if (this.title === '' && this.file) {
        this.title = this.file.name
      }
      this.loading = true
      let l = null
      if (this.type === 'league') {
        l = new League({ id: this.options.id })
      } else {
        l = new Tournament({ id: this.options.id })
      }
      const d = new Document({ title: this.title, file: this.file }).for(l)
      d.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali dokument'),
            type: 'is-success',
          })
          this.loading = false
          this.file = null
          this.title = ''
          this.$emit('reload')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading = false
        })
    },
    deleteDocument(item) {
      this.loading = true
      const d = new Document({ id: item })
      d.delete()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste uklonili dokument'),
            type: 'is-success',
          })
          this.loading = false
          this.$emit('reload')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    documentIcon(type) {
      switch (type) {
        case 'application/pdf':
          return 'file-pdf'
        case 'application/doc':
          return 'file-word'
      }
      return 'file'
    },
    closeDialog() {
      this.isModalConfirmation = false
      this.to = null
    },
    discardChanges() {
      this.isModalConfirmation = false
      this.$router.push(this.to)
    },
    chooseFiles() {
      document.getElementById('fileInput').click()
    },
  },
}
</script>
