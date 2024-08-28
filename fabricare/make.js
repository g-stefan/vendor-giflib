// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor");

messageAction("make");

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/bin");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

if (OS.isWindows()) {
	Shell.copyFile("fabricare/source/gif_font.c", "source/gif_font.c");
};

global.xyoCCExtra = function () {
	arguments.push(

		"--inc=output/include",
		"--use-lib-path=output/lib",
		"--rc-inc=output/include",

		"--inc=" + pathRepository + "/include",
		"--use-lib-path=" + pathRepository + "/lib",
		"--rc-inc=" + pathRepository + "/include"

	);
	return arguments;
};

var compileProject = {
	"project": "giflib",
	"includePath": [
		"output/include",
		"source",
	],
	"cSource": [
		"source/dgif_lib.c",
		"source/egif_lib.c",
		"source/gifalloc.c",
		"source/gif_err.c",
		"source/gif_font.c",
		"source/gif_hash.c",
		"source/openbsd-reallocarray.c",
	],
	"resources": {
		"includePath": [
			"source"
		]
	}
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
if (Fabricare.isStatic()) {
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--lib", "--output-lib-path=output/lib")));
};
if (Fabricare.isDynamic()) {
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll", "--output-bin-path=output/bin", "--output-lib-path=output/lib")));
};

