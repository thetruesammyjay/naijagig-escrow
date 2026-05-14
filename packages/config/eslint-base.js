const eslintBaseConfig = [
	{
		ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/.turbo/**"]
	},
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module"
		},
		rules: {
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			"prefer-const": "error"
		}
	}
];

export default eslintBaseConfig;
