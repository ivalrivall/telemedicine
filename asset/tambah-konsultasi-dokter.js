Vue.component("v-select", VueSelect.VueSelect);

var application = new Vue({
  el: "#tambah-konsultasi",
  components: { VueTimepicker: VueTimepicker.default },
  created() {
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  },
  data: {
    baseUrl: baseUrl,
    disops: {
      provinsi: false,
      klinik: false,
    },
    provinsi: null,
    provinsi_options: [],
    klinik: null,
    klinik_options: [],
    dokter_options: [], // To store available doctors
    selected_kuota: {}, // To store selected kuota for each doctor
    biaya_tarif: null,
    bank: null,
    rekening: null,
    kodeVoucher: "",
    voucher_info: null, // Properti data baru untuk menyimpan informasi voucher
  },
  watch: {
    klinik: function (newKlinik) {
      if (this.provinsi && newKlinik) {
        this.fetchAvailableDoctors();
      }
    },
  },
  methods: {
    formatCurrency(value) {
      // Convert value to number first
      const numberValue = Number(value);
      if (isNaN(numberValue)) {
        return value;
      }
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numberValue);
    },
    handleKuotaChange(dokter, kuotaIndex) {
      this.$set(this.selected_kuota, dokter.id, kuotaIndex); // Gunakan Vue's reactivity system untuk men-set value

      // Update biaya_tarif, bank, dan rekening berdasarkan kuota yang dipilih
      const selectedKuotaIndex = this.selected_kuota[dokter.id];
      if (selectedKuotaIndex !== undefined) {
        this.biaya_tarif = dokter.biaya_tarif[selectedKuotaIndex] || null;
        this.bank = dokter.bank[selectedKuotaIndex] || null;
        this.rekening = dokter.rekening[selectedKuotaIndex] || null;
      } else {
        this.biaya_tarif = null;
        this.bank = null;
        this.rekening = null;
      }
    },
    fetchOptionsProvinsi(search) {
      axios
        .post(
          "../administrator/xhrRefPemda",
          JSON.stringify({ params: { ref: "provinsi", search: search } })
        )
        .then((res) => {
          this.provinsi_options = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectedOptionProvinsi(value) {
      this.provinsi = value;
      this.klinik = null;
      this.klinik_options = [];
      this.dokter_options = []; // Reset daftar dokter
      this.selected_kuota = {}; // Reset pilihan kuota
      this.biaya_tarif = null; // Reset biaya tarif
      this.bank = null; // Reset informasi bank
      this.rekening = null; // Reset informasi rekening
    },
    fetchOptionsKlinik(search) {
      axios
        .post(
          "../administrator/xhrKlinik",
          JSON.stringify({
            params: { ref: "klinik", provinsi: this.provinsi, search: search },
          })
        )
        .then((res) => {
          this.klinik_options = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectedOptionKlinik(value) {
      // this.klinik = value;
      // this.dokter_options = [];
      this.klinik = value;
      this.dokter_options = []; // Reset daftar dokter
      this.selected_kuota = {}; // Reset pilihan kuota
      this.biaya_tarif = null; // Reset biaya tarif
      this.bank = null; // Reset informasi bank
      this.rekening = null; // Reset informasi rekening
    },
    fetchAvailableDoctors() {
      const params = { provinsi: this.provinsi, klinik: this.klinik };

      axios
        .post(
          "../administrator/getDoctorsByProvinceAndClinic",
          JSON.stringify({ params })
        )
        .then((res) => {
          this.dokter_options = res.data;
          console.log(res.data);
          if (res.data.length > 0) {
            const firstDoctor = res.data[0];
            // this.biaya_tarif = firstDoctor.biaya_tarif;
            this.biaya_tarif = Number(firstDoctor.biaya_tarif[0]) || null; // Convert to number
            this.bank = firstDoctor.bank;
            this.rekening = firstDoctor.rekening;
          } else {
            this.biaya_tarif = null;
            this.bank = null;
            this.rekening = null;
          }
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    },
  },
});
