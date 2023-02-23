module "secrets" {
  source    = "git@github.com:PrestaShopCorp/terraform-secrets.git?ref=v2.3.0"
  namespace = "qanightlyresults"
  labels    = var.labels
  prefix    = "qanightlyresults-test"
  secrets = [
    {
      kube_name = "env-variable"
      kube_type = "secret"
      kube_data = {
        "QANB_API_DOMAIN" = "https://integration-api-nightly.prestashop.com/"
        "QANB_GA_KEY"     = "UA-2753771-46"
      }
    },
    {
      kube_name = "service-account"
      kube_type = "secret"
      kube_data = {
        "credentials.json" = var.service_account_key
      }
    }
  ]
}

module "deployement" {
  source     = "git@github.com:PrestaShopCorp/terraform-deployments.git?ref=v2.3.0"
  namespace  = "qanightlyresults"
  labels     = var.labels
  gcp_secret = module.secrets.secrets_names_maps["service-account"]
  deploys = [
    {
      name     = "qanightlyresults-test"
      strategy = "RollingUpdate"
      endpoint = {
        enable   = true
        external = false
        port     = 8081
      }
      secrets = [
        module.secrets.secrets_names_maps["env-variable"]
      ]
      esp = {
        enable = true
        port   = 3000
      }
      containers = [{
        name           = "qanightlyresults-test-pod"
        image          = var.image
        version        = var.app_version
        cpu_request    = "100m"
        cpu_limits     = "150m"
        memory_request = "200Mi"
        memory_limits  = "300Mi"
        port           = 3000
      }]
    },
  ]
}
