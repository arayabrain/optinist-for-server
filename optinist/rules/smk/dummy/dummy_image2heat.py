rule:
    input:
        config["rules"]["dummy_image2heat"]["input"]
    output:
        config["rules"]["dummy_image2heat"]["output"]
    # run:
    #     __func_config = config["rules"]["dummy_image2heat"]
    #     run_script(__func_config)
    script:
        "../../scripts/dummy/dummy_image2heat.py"