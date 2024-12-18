const name = "deno-cli-template";
const version = "refs/heads/main";
const baseUrl =
  `https://raw.githubusercontent.com/ansanloms/${name}/${version}`;

const getTempFile = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const tempFile = await Deno.makeTempFile();

  await Deno.writeFile(
    tempFile,
    new Uint8Array(await response.arrayBuffer()),
  );

  return tempFile;
};

const command = new Deno.Command(Deno.execPath(), {
  args: [
    "install",
    "--global",
    "--reload",
    "--force",
    "--allow-all",
    "--name",
    name,
    "--config",
    await getTempFile(`${baseUrl}/deno.json`),
    "--lock",
    await getTempFile(`${baseUrl}/deno.lock`),
    `${baseUrl}/cli.ts`,
  ],
});

const child = command.spawn();

const status = await child.status;
Deno.exit(status.code);
