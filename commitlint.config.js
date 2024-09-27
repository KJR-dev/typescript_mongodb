module.exports = {
    extends: ["@commitlint/cli", "@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                'feat',      // New feature or functionality
                'build',     // Changes related to build system or external dependencies (e.g., gulp, npm)
                'chore',     // Routine tasks, maintenance, or changes that don't modify src or tests (e.g., updating build scripts)
                'ci',        // Continuous Integration changes (e.g., configuring Travis, Jenkins, etc.)
                'docs',      // Documentation changes (e.g., updating README or adding comments in the code)
                'feat',      // (Repeated) New feature or functionality
                'fix',       // Bug fixes
                'perf',      // Performance improvements or optimizations
                'refactor',  // Code changes that neither fix a bug nor add a feature (e.g., code restructuring)
                'revert',    // Reverting a previous commit
                'style',     // Changes that do not affect the meaning of the code (e.g., formatting, missing semi-colons)
                'test',      // Adding or updating tests

            ]
        ],
        "subject-case": [2, "always", "sentence-case"]
    }
}