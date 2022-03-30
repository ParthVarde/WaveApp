async function main() {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    const WavePortal = await hre.ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();

    await wavePortal.deployed();

    console.log("Wave Portal deployed to:", wavePortal.address);

    let totalWaves = await wavePortal.totalNumberWaves();
    console.log(totalWaves);

    let wave = await wavePortal.wave();
    await wave.wait();

    wave = await wavePortal.connect(randomPerson).wave();
    await wave.wait();

    totalWaves = await wavePortal.totalNumberWaves();
    console.log(totalWaves);

    let allPeopleWaved = await wavePortal.allPeopleThatWaved();
    console.log(allPeopleWaved);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });