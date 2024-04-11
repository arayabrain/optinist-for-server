import argparse


def main(args):
    from studio.app.optinist.core.expdb.batch_runner import ExpDbBatchRunner

    runner = ExpDbBatchRunner(args.org_id)
    runner.process()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="expdb_batch")
    parser.add_argument(
        "-o", "--org_id", type=int, required=True, help="organization id"
    )

    from studio.app.optinist.microscopes.ND2Reader import ND2Reader

    # Note: @v1.2.0
    # optinist と caiman を同時インストールした環境（conda環境想定）では、
    # MicroscopeReader と caiman 間で .so (libtiff) のバージョン競合が生じることから、
    # ここで事前に（ExpDbBatchRunnerのimport前に） MicroscopeReader を 初期化し、
    # MicroscopeReader に必要な .so を先行loadする対処をとっている。
    ND2Reader()

    main(parser.parse_args())
