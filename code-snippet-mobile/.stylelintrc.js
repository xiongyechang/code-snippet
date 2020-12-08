module.exports = {
	extends: ["stylelint-config-standard", "stylelint-config-sass-guidelines"],
	rules: {
			"unit-no-unknown": [
				true, {
					"ignoreUnits": ["rpx"]
				},
			],
    	// "at-rule-empty-line-before": "always"|"never",
    	// "at-rule-name-case": "lower"|"upper",
    	// "block-no-empty": true,
			"unit-allowed-list": ["px", "em", "rem", "%", "vw", "vh", "rpx", "upx"]
  	}
}