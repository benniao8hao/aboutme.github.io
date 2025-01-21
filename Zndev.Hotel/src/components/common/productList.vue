<template>
	<div class="weui-panel weui-panel_access products">
		<div class="weui-panel__hd">
			<slot name="header"></slot>
		</div>
		<div class="weui-panel__bd">
			<slot></slot>
		</div>
		<div class="weui-panel__ft">
			<slot name="footer"></slot>
		</div>
	</div>
</template>