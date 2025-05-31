<template>
	<div class="app-layout">
		<HeaderComponent />
		<MainComponent>
			<router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<keep-alive v-if="$route.meta.keepAlive">
						<component :is="Component" />
					</keep-alive>
					<component v-else :is="Component" />
				</transition>
			</router-view>
		</MainComponent>
		<FooterComponent />
	</div>
</template>

<script>
import HeaderComponent from "./header/index.vue";
import MainComponent from "./main/index.vue";
import FooterComponent from "./footer/index.vue";

export default {
	name: "AppLayout",
	components: {
		HeaderComponent,
		MainComponent,
		FooterComponent,
	},
};
</script>

<style lang="scss" scoped>
.app-layout {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #f5f7fa;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
