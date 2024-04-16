use anyhow::Error;
use fluentci_pdk::dag;

pub fn setup_pulumi() -> Result<String, Error> {
    let home = dag().get_env("HOME")?;
    let pulumi_home = format!("{}/.pulumi", home);
    let path = dag().get_env("PATH")?;
    dag().set_envs(vec![(
        "PATH".into(),
        format!("{}/bin:{}", pulumi_home, path),
    )])?;

    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["curl"])?
        .with_exec(vec![
            "type pulumi > /dev/null 2>&1 || curl -fsSL https://get.pulumi.com | sh",
        ])?
        .stdout()?;
    Ok(stdout)
}
