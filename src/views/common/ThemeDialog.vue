<template>
    <v-container fluid>
        <v-row>
            <v-col
                key="0"
                class="d-flex child-flex"
                cols="4"
            >
                <v-card
                    tile 
                    class="d-flex" 
                    :class="active === 0 ? 'active-theme' : ''" 
                    @click="selectTheme(0)"
                    hover
                >
                    <v-img
                        :src="require(`@/assets/themes/default.jpg`)"
                        aspect-ratio="1.7778"
                        class="grey lighten-2"
                    >
                        <template v-slot:placeholder>
                            <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                </v-card>
            </v-col>
            <v-col
                v-for="n in themes"
                :key="n"
                class="d-flex child-flex"
                cols="4"
            >
                <v-card
                    tile 
                    class="d-flex" 
                    :class="active === n ? 'active-theme' : ''" 
                    @click="selectTheme(n)"
                    hover
                >
                    <v-img
                        :src="require(`@/assets/themes/img_${ n }.jpg`)"
                        aspect-ratio="1.7778"
                        class="grey lighten-2"
                    >
                        <template v-slot:placeholder>
                            <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
export default {
    name: 'ThemeDialog',
    props: {
        active: {
            type: Number,
            required: true
        }
    },
    data: () => ({
        themes: 6
    }),
    computed: {
        activeLocal: {
            get() {
                return this.acitve
            },
            set(val) {
                this.$emit('select', val)
            }
        }
    },
    methods: {
        selectTheme(n) {
            this.activeLocal = n
        }
    },
}
</script>
<style scoped>
.active-theme {
    outline: 2px solid cyan;
}
</style>