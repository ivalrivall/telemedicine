Vue.component('v-select', VueSelect.VueSelect);
var application = new Vue({
    el: '#vue-regklinik',
    components: { VueTimepicker: VueTimepicker.default },
    created() {
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    },
    data: {
        valid: false,
        show: false,
        transitionName: 'fade',
        msg: null,
        disops: {
            'provinsi': false,
            'kabupaten': false,
            'kecamatan': false,
            'kelurahan': false
        },
        provinsi: null,
        provinsi_options: [],
        kabupaten: null,
        kabupaten_options: [],
        kecamatan: null,
        kecamatan_options: [],
        kelurahan: null,
        kelurahan_options: [],
        action: null,  
        prov_klinik: null,
        kab_klinik: null,
        kec_klinik: null,
        kel_klinik: null,
        t1_start: '',
        t1_end: '',
        t2_start: '',
        t2_end: '',
        t3_start: '',
        t3_end: ''
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        time_handler(event, tref) {
            if (tref === 't1_start') {
                this.t1_start = event.displayTime;
            }
            if (tref === 't1_end') {
                this.t1_end = event.displayTime;
            }
            if (tref === 't2_start') {
                this.t2_start = event.displayTime;
            }
            if (tref === 't2_end') {
                this.t2_end = event.displayTime;
            }
            if (tref === 't3_start') {
                this.t3_start = event.displayTime;
            }
            if (tref === 't3_end') {
                this.t3_end = event.displayTime;
            }
        },
        fetchOptionsProvinsi: function(search) {
            axios.post('../administrator/xhrRefPemda', JSON.stringify({
            params: {
                ref: 'provinsi',
                search: search
            }
            })).then(res => {
            this.provinsi_options = res.data;
            // console.log(this.provinsi_options);
            }).catch(err => {
            console.log(err);
            });
        },
        selectedOptionProvinsi: function(value) {
            this.provinsi = value;
            console.log("provinsi: " + this.provinsi);
            this.kabupaten = null;
            this.kabupaten_options = [];
            this.kecamatan = null;
            this.kecamatan_options = [];
            this.kelurahan = null;
            this.kelurahan_options = [];
            this.prov_klinik = this.provinsi;
        },
        fetchOptionsKabupaten: function(search) {
            axios.post('../administrator/xhrRefPemda', JSON.stringify({
            params: {
                ref: 'kabupaten',
                provinsi: this.provinsi,
                search: search
            }
            })).then(res => {
            this.kabupaten_options = res.data;
            }).catch(err => {
            console.log(err);
            });
        },
        selectedOptionKabupaten: function(value) {
            this.kabupaten = value;
            console.log("kabupaten: " + this.kabupaten);
            this.kecamatan = null;
            this.kecamatan_options = [];
            this.kelurahan = null;
            this.kelurahan_options = [];
            this.kab_klinik = this.kabupaten;
        },
        fetchOptionsKecamatan: function(search) {
            axios.post('../administrator/xhrRefPemda', JSON.stringify({
            params: {
                ref: 'kecamatan',
                kabupaten: this.kabupaten,
                search: search
            }
            })).then(res => {
            this.kecamatan_options = res.data;
            }).catch(err => {
            console.log(err);
            });
        },
        selectedOptionKecamatan: function(value) {
            this.kecamatan = value;
            console.log("kecamatan: " + this.kecamatan);
            this.kelurahan = null;
            this.kelurahan_options = [];
            this.kec_klinik = this.kecamatan;
        },
        fetchOptionsKelurahan: function(search) {
            axios.post('../administrator/xhrRefPemda', JSON.stringify({
            params: {
                ref: 'kelurahan',
                kabupaten: this.kabupaten,
                kecamatan: this.kecamatan,
                search: search
            }
            })).then(res => {
            this.kelurahan_options = res.data;
            }).catch(err => {
            console.log(err);
            });
        },
        selectedOptionKelurahan: function(value) {
            this.kelurahan = value;
            console.log("kelurahan: " + this.kelurahan);
            this.kel_klinik = this.kelurahan;
        }
    }
});