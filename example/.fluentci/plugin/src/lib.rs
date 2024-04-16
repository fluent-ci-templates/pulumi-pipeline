use std::vec;

use extism_pdk::*;
use fluentci_pdk::dag;

use crate::helpers::setup_pulumi;

pub mod helpers;

#[plugin_fn]
pub fn setup() -> FnResult<String> {
    let stdout = setup_pulumi()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn preview(args: String) -> FnResult<String> {
    setup_pulumi()?;

    let stdout = dag()
        .pipeline("preview")?
        .with_exec(vec!["pulumi", "preview", "--non-interactive", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn up(args: String) -> FnResult<String> {
    setup_pulumi()?;

    let stdout = dag()
        .pipeline("up")?
        .with_exec(vec!["pulumi", "up", "--yes", "--non-interactive", &args])?
        .stdout()?;
    Ok(stdout)
}
