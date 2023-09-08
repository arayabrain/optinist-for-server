import argparse

from studio.app.optinist.core.expdb.batch_runner import ExpDbBatchRunner


def main(args):
    runner = ExpDbBatchRunner(args.org_id)
    runner.process()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="expdb_batch")
    parser.add_argument(
        "-o", "--org_id", type=int, required=True, help="organization id"
    )

    main(parser.parse_args())
