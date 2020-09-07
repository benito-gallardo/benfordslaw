<template>
  <div class="file-upload">
    <v-form v-model="valid" :lazy-validation="lazy" ref="form">
      <v-file-input
        small-chips
        :dark="true"
        label="Choose a file"
        v-model="tempFile"
        class="text-white mt-0"
        :rules="[(v) => !!v || 'This is required']"
        required
      ></v-file-input>
      <v-text-field
        :dark="true"
        v-model="columnTitle"
        prepend-icon="mdi-format-title"
        label="Column Title to Parse"
        background-color="transparent"
        :clearable="true"
        :rules="[(v) => !!v || 'This is required']"
        required
      >
      </v-text-field>
      <v-btn class="ma-2" :disabled="!valid" color="primary" @click="validate">
        Upload File
      </v-btn>
      <p v-if="fileError" class="error--text file-error">{{ fileError }}</p>
    </v-form>
  </div>
</template>

<script>
import VuePapaParse from '../plugins/vuepapaparse';
export default {
  name: 'FileUpload',
  VuePapaParse,
  data: () => ({
    tempFile: null,
    columnTitle: null,
    valid: true,
    lazy: false,
    fileError: null,
  }),
  methods: {
    validate() {
      this.$refs.form.validate() === true ? this.readFile(this.tempFile) : '';
    },
    reset() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
    readFile() {
      this.loader = 'loading';
      const config = {
        delimiter: '',
        newline: '',
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        dynamicTyping: true,
        preview: 0,
        encoding: '',
        delimitersToGuess: [',', '\t', '|', ';'],
        complete: this.checkFile,
        error: this.error,
      };
      this.$papa.parse(this.tempFile, config);
    },
    checkFile({ data }) {
      const objToCheck = data[0];
      if (!Object.prototype.hasOwnProperty.call(objToCheck, this.columnTitle)) {
        return (this.fileError = 'Column title does not exist in file');
      } else if (typeof objToCheck[this.columnTitle] !== 'number') {
        return (this.fileError = 'Column is not a number');
      } else {
        this.fileError = null;
        this.sendFile(data, this.columnTitle);
      }
    },
    sendFile(data, columnTitle) {
      this.$emit('uploaded', { data, columnTitle });
      this.reset();
    },
    error(e) {
      console.error(e);
    },
  },
};
</script>

<style lang="scss" scoped>
.file-upload {
  width: 100%;
}
.file-error {
  font-size: 14px;
  margin: 5px 7px;
}
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: #e0e0e0 !important;
  color: #a6a6a6 !important;
}
</style>
